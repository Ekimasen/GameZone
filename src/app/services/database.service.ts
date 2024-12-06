import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private dbcon!: SQLiteDBConnection;
  private user!: any;

  constructor() { }

  // Initialize the database connection
  async initDb() {
    try {
      this.dbcon = await this.sqlite.createConnection('gamezone', false, 'no-encryption', 1, false);
      await this.dbcon.open();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // Initialize the user table if it doesn't exist
  async initTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL CHECK(length(password) >= 8),
          profilePicture TEXT  -- Add this line to include the profilePicture column
        )
      `;
    await this.dbcon.execute(query);

    } catch (error) {
      console.error('Error initializing table:', error);
    }
  }

  // Create a new user
  async create(name: any, email: any, password: any) {
    try {
      const query = `INSERT INTO user (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
      await this.dbcon.execute(query);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  // Read the currently logged-in user's profile by email
  async read(email: string) {
    try {
      const query = `SELECT * FROM user WHERE email = '${email}'`;
      const result = await this.dbcon.query(query);
      this.user = result.values;
      return this.user;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return null; 
    }
  }

// Update user details (name, email, password, profilePicture)
async updateUser(id: number, name: string, email: string, password: string, profilePicture: string | undefined) {
  try {
    // Build the query string dynamically based on whether the profilePicture is provided
    const query = `
      UPDATE user
      SET name = '${name}', 
          email = '${email}', 
          password = '${password}'
          ${profilePicture ? `, profilePicture = '${profilePicture}'` : ''}
      WHERE id = ${id}
    `;
    await this.dbcon.execute(query);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

  

  // Create session table to track logged-in user
  async initSessionTable() {
    try {
      const query = `CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES user(id))`;
      await this.dbcon.execute(query);
    } catch (error) {
      console.error('Error initializing session table:', error);
    }
  }

  // Store logged-in user in session table
  async storeSession(userId: number) {
    try {
      const query = `INSERT INTO session (user_id) VALUES (${userId})`;
      await this.dbcon.execute(query);
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  // Get logged-in user ID from session table
  async getLoggedInUserId() {
    try {
      const query = `SELECT user_id FROM session LIMIT 1`;  
      const result = await this.dbcon.query(query);
      if (result?.values?.length) {
        return result.values[0].user_id; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error('Error fetching logged-in user ID:', error);
      return null;
    }
  }

  // Get user data by user_id
  async getUserById(userId: number) {
    try {
      const query = `SELECT * FROM user WHERE id = ${userId}`;
      const result = await this.dbcon.query(query);
      if (result?.values?.length) {
        return result.values[0]; 
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  // Clear session (logout)
  async clearSession() {
    try {
      const query = `DELETE FROM session`; 
      await this.dbcon.execute(query);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}
