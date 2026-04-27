#pragma once
#include <string>
#include <vector>
#include <functional>
#include "Token.hpp"
#include "MathFunctions.hpp"

class Parser {
public:
    explicit Parser(AngleUnit angleUnit = AngleUnit::DEGREES);

    CalcResult evaluate(const std::string& expression);

private:
    AngleUnit m_angleUnit;

    std::vector<Token> tokenize(const std::string& expr);
    std::vector<Token> shuntingYard(const std::vector<Token>& tokens);
    CalcResult evaluateRPN(const std::vector<Token>& rpn);

    int precedence(const Token& op) const;
    bool isRightAssociative(const Token& op) const;
    bool isOperator(const std::string& s) const;
};
