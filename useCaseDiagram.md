# Use Case Diagram

## Actors
- **User**: The individual tracking their personal finances.

## Use Cases
- Register Account
- Login to Account
- Add a Transaction
- Edit a Transaction
- Delete a Transaction
- View Transaction History
- View Dashboard & Reports

## Mermaid Diagram
```mermaid
graph TD
    User --> RegisterAccount
    User --> Login
    
    User --> AddTransaction
    User --> EditTransaction
    User --> DeleteTransaction
    User --> ViewHistory
    User --> ViewDashboard

    %% Note: Transactions imply categorization and selecting payment methods
```
