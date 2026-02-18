# Class Diagram

```mermaid
classDiagram

class Transaction {
  +string id
  +float amount
  +date date
  +string category
  +getDetails()
}

class Expense {
  +string paymentMethod
  +addExpense()
}

class Income {
  +string source
  +addIncome()
}

class Category {
  +string id
  +string name
  +string description
}

class FinanceManager {
  +addTransaction()
  +calculateBalance()
  +generateReport()
  +saveData()
  +loadData()
}

Transaction <|-- Expense
Transaction <|-- Income
Transaction --> Category
FinanceManager --> Transaction
