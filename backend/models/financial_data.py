from dataclasses import dataclass

@dataclass
class FinancialData:
    date: str
    cash_in: float
    cash_out: float
    cumulative_cash: float
