#include "Parser.hpp"
#include <cctype>
#include <cmath>
#include <sstream>
#include <stack>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>

static const std::unordered_map<std::string, int> FUNC_ARITY = {
    {"sin", 1}, {"cos", 1}, {"tan", 1},
    {"log", 1}, {"ln", 1}, {"sqrt", 1}, {"cbrt", 1},
    {"pow", 2}
};

static const std::unordered_set<std::string> FUNC_NAMES = {
    "sin", "cos", "tan", "log", "ln", "sqrt", "cbrt", "pow"
};

static const std::unordered_map<std::string, double> CONSTANTS = {
    {"pi", 3.14159265358979323846},
    {"e",  2.71828182845904523536}
};

Parser::Parser(AngleUnit angleUnit) : m_angleUnit(angleUnit) {}

CalcResult Parser::evaluate(const std::string& expression) {
    try {
        auto tokens = tokenize(expression);
        if (tokens.empty()) {
            return CalcResult{0, false, ErrorResult{true, "EMPTY", "Empty expression"}};
        }
        auto rpn = shuntingYard(tokens);
        return evaluateRPN(rpn);
    } catch (const std::exception& e) {
        return CalcResult{0, false, ErrorResult{true, "PARSE_ERROR", e.what()}};
    }
}

std::vector<Token> Parser::tokenize(const std::string& expr) {
    std::vector<Token> tokens;
    size_t i = 0;
    size_t len = expr.length();

    auto skipWhitespace = [&]() {
        while (i < len && std::isspace(static_cast<unsigned char>(expr[i]))) ++i;
    };

    while (i < len) {
        skipWhitespace();
        if (i >= len) break;

        char c = expr[i];

        // Number
        if (std::isdigit(static_cast<unsigned char>(c)) || c == '.') {
            std::string num;
            bool hasDot = (c == '.');
            while (i < len && (std::isdigit(static_cast<unsigned char>(expr[i])) || expr[i] == '.')) {
                num += expr[i];
                if (expr[i] == '.') {
                    if (hasDot) break; // second dot
                    hasDot = true;
                }
                ++i;
            }
            // Handle function-like number (unlikely but safe)
            try {
                size_t pos = 0;
                double val = std::stod(num, &pos);
                if (pos == num.length()) {
                    tokens.push_back({ETokenType::NUMBER, val});
                } else {
                    return {};
                }
            } catch (...) {
                return {};
            }
            continue;
        }

        // Letters: function names or constants
        if (std::isalpha(static_cast<unsigned char>(c))) {
            std::string word;
            while (i < len && std::isalpha(static_cast<unsigned char>(expr[i]))) {
                word += expr[i];
                ++i;
            }
            std::string lower = word;
            std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

            if (CONSTANTS.count(lower)) {
                tokens.push_back({ETokenType::CONSTANT, lower});
            } else if (FUNC_NAMES.count(lower)) {
                tokens.push_back({ETokenType::FUNCTION, lower});
            } else {
                // Treat as unknown constant -> 0
                tokens.push_back({ETokenType::NUMBER, 0.0});
            }
            continue;
        }

        // Operators and parentheses
        ++i;
        switch (c) {
            case '+': tokens.push_back({ETokenType::OPERATOR, EOp::ADD}); break;
            case '-': tokens.push_back({ETokenType::OPERATOR, EOp::SUB}); break;
            case '*': tokens.push_back({ETokenType::OPERATOR, EOp::MUL}); break;
            case '/': tokens.push_back({ETokenType::OPERATOR, EOp::DIV}); break;
            case '%': tokens.push_back({ETokenType::OPERATOR, EOp::MOD}); break;
            case '^': tokens.push_back({ETokenType::OPERATOR, EOp::POW}); break;
            case '(': tokens.push_back({ETokenType::LPAREN, std::string("(")}); break;
            case ')': tokens.push_back({ETokenType::RPAREN, std::string(")")}); break;
            default: break;
        }
    }

    return tokens;
}

int Parser::precedence(const Token& op) const {
    switch (op.asOperator()) {
        case EOp::ADD: case EOp::SUB: return 2;
        case EOp::MUL: case EOp::DIV: case EOp::MOD: return 3;
        case EOp::POW: return 4;
    }
    return 0;
}

bool Parser::isRightAssociative(const Token& op) const {
    return op.asOperator() == EOp::POW;
}

bool Parser::isOperator(const std::string& s) const {
    return s == "+" || s == "-" || s == "*" || s == "/" || s == "%" || s == "^";
}

std::vector<Token> Parser::shuntingYard(const std::vector<Token>& tokens) {
    std::vector<Token> output;
    std::stack<Token> opStack;

    for (const auto& token : tokens) {
        switch (token.type) {
            case ETokenType::NUMBER:
            case ETokenType::CONSTANT:
                output.push_back(token);
                break;

            case ETokenType::FUNCTION:
                opStack.push(token);
                break;

            case ETokenType::OPERATOR: {
                while (!opStack.empty()) {
                    const auto& top = opStack.top();
                    if (top.type == ETokenType::OPERATOR &&
                        ((!isRightAssociative(token) && precedence(top) >= precedence(token)) ||
                         (isRightAssociative(token) && precedence(top) > precedence(token)))) {
                        output.push_back(top);
                        opStack.pop();
                    } else {
                        break;
                    }
                }
                opStack.push(token);
                break;
            }

            case ETokenType::LPAREN:
                opStack.push(token);
                break;

            case ETokenType::RPAREN: {
                while (!opStack.empty() && opStack.top().type != ETokenType::LPAREN) {
                    output.push_back(opStack.top());
                    opStack.pop();
                }
                if (!opStack.empty() && opStack.top().type == ETokenType::LPAREN) {
                    opStack.pop(); // discard (
                }
                // If the token on top of stack is a function, pop it
                if (!opStack.empty() && opStack.top().type == ETokenType::FUNCTION) {
                    output.push_back(opStack.top());
                    opStack.pop();
                }
                break;
            }

            default: break;
        }
    }

    while (!opStack.empty()) {
        output.push_back(opStack.top());
        opStack.pop();
    }

    return output;
}

CalcResult Parser::evaluateRPN(const std::vector<Token>& rpn) {
    std::stack<double> stack;

    for (const auto& token : rpn) {
        switch (token.type) {
            case ETokenType::NUMBER:
                stack.push(token.asNumber());
                break;

            case ETokenType::CONSTANT: {
                static const std::unordered_map<std::string, double> constMap = {
                    {"pi", 3.14159265358979323846},
                    {"e",  2.71828182845904523536}
                };
                auto it = constMap.find(token.asString());
                stack.push(it != constMap.end() ? it->second : 0.0);
                break;
            }

            case ETokenType::FUNCTION: {
                const auto& name = token.asString();
                auto it = FUNC_ARITY.find(name);
                int arity = (it != FUNC_ARITY.end()) ? it->second : 1;

                if (arity == 1) {
                    if (stack.empty()) return CalcResult{0, false, ErrorResult{true, "EVAL_ERROR", "Stack underflow"}};
                    double a = stack.top(); stack.pop();
                    auto result = applyMathFunction(name, a, m_angleUnit);
                    if (result.error.hasError) return result;
                    stack.push(result.value);
                } else if (arity == 2) {
                    if (stack.size() < 2) return CalcResult{0, false, ErrorResult{true, "EVAL_ERROR", "Stack underflow"}};
                    double b = stack.top(); stack.pop();
                    double a = stack.top(); stack.pop();
                    auto result = applyMathFunction2(name, a, b);
                    if (result.error.hasError) return result;
                    stack.push(result.value);
                }
                break;
            }

            case ETokenType::OPERATOR: {
                if (stack.size() < 2) return CalcResult{0, false, ErrorResult{true, "EVAL_ERROR", "Not enough operands"}};
                double b = stack.top(); stack.pop();
                double a = stack.top(); stack.pop();
                double result = 0;

                switch (token.asOperator()) {
                    case EOp::ADD: result = a + b; break;
                    case EOp::SUB: result = a - b; break;
                    case EOp::MUL: result = a * b; break;
                    case EOp::DIV:
                        if (b == 0) return CalcResult{0, false, ErrorResult{true, "DIVISION_BY_ZERO", "Cannot divide by zero"}};
                        result = a / b;
                        break;
                    case EOp::MOD:
                        if (b == 0) return CalcResult{0, false, ErrorResult{true, "DIVISION_BY_ZERO", "Cannot divide by zero"}};
                        result = std::fmod(a, b);
                        break;
                    case EOp::POW:
                        result = std::pow(a, b);
                        if (std::isinf(result)) {
                            return CalcResult{0, true, ErrorResult{false}};
                        }
                        break;
                }

                if (std::isinf(result)) {
                    return CalcResult{0, true, ErrorResult{false}};
                }
                stack.push(result);
                break;
            }

            default: break;
        }
    }

    if (stack.empty()) {
        return CalcResult{0, false, ErrorResult{true, "EVAL_ERROR", "No result produced"}};
    }

    double finalResult = stack.top();
    return CalcResult{finalResult, std::isinf(finalResult), ErrorResult{false}};
}
