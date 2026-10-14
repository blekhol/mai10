import { Injectable } from '@nestjs/common';
import mysql from "mysql2/promise"
import { Festmeny } from './festmeny.js';

const mysqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "festmenyek",
  
});

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async festmenyDb() {
    const [results] = await mysqlConnection
      .execute("SELECT COUNT(*) AS db FROM festmenyek");
    const rows = results as any;
    return rows[0].db as number;
  }

  async festmenyLista(minev: number) {
    const [results] = await mysqlConnection
      .execute("SELECT id, title, painter, painted_at FROM festmenyek WHERE painted_at >= ?",
        [ minev ]
      );
    const rows = results as Festmeny[];
    return rows;
  }

  async ujFestmeny(title: string, painter: string, painted_at: number) {
    const [results] = await mysqlConnection.execute(
        "INSERT INTO festmenyek (title, painter, painted_at) VALUES (?,?,?)",
      [title, painter, painted_at]
    );
    
    const rows = results as any;
    return {
      id: rows.insertId,
      title,
      painter,
      painted_at
    } as Festmeny
  }
}
