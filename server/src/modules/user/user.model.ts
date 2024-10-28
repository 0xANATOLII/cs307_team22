export interface User {
  _id: string; // Ensure _id is included
  username: string;
  // ... other properties ...
}

// Define and export UserDocument if needed
export type UserDocument = User; // or extend it if necessary

