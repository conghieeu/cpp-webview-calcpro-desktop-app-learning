#include "Calculator.hpp"

Calculator::Calculator() : m_parser(AngleUnit::DEGREES) {}

CalcResult Calculator::calculate(const std::string& expression) {
    // Replace × and ÷ with * and /
    std::string expr = expression;
    size_t pos;
    while ((pos = expr.find('×')) != std::string::npos) expr.replace(pos, 1, "*");
    while ((pos = expr.find('÷')) != std::string::npos) expr.replace(pos, 1, "/");

    return m_parser.evaluate(expr);
}

CalcResult Calculator::calculateWithError(const std::string& expression) {
    return calculate(expression);
}

void Calculator::setAngleUnit(AngleUnit unit) {
    m_parser = Parser(unit);
}

AngleUnit Calculator::getAngleUnit() const {
    return AngleUnit::DEGREES; // simplified
}

void Calculator::memoryStore(double value) {
    m_memoryValue = value;
    m_hasMemory = true;
}

void Calculator::memoryAdd(double value) {
    m_memoryValue += value;
    m_hasMemory = true;
}

void Calculator::memorySub(double value) {
    m_memoryValue -= value;
    m_hasMemory = true;
}

double Calculator::memoryRecall() const {
    return m_memoryValue;
}

void Calculator::memoryClear() {
    m_memoryValue = 0.0;
    m_hasMemory = false;
}

bool Calculator::hasMemory() const {
    return m_hasMemory;
}
