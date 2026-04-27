#pragma once
#include "Parser.hpp"
#include "Token.hpp"

class Calculator {
public:
    Calculator();

    CalcResult calculate(const std::string& expression);
    CalcResult calculateWithError(const std::string& expression);

    void setAngleUnit(AngleUnit unit);
    AngleUnit getAngleUnit() const;

    // Memory operations
    void memoryStore(double value);
    void memoryAdd(double value);
    void memorySub(double value);
    double memoryRecall() const;
    void memoryClear();
    bool hasMemory() const;

private:
    Parser m_parser;
    double m_memoryValue = 0.0;
    bool m_hasMemory = false;
};
