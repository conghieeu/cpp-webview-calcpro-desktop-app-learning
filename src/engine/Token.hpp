#pragma once
#include <string>

enum class ETokenType {
    NUMBER,
    OPERATOR,
    FUNCTION,
    LPAREN,
    RPAREN,
    CONSTANT,
    END
};

enum class EOp : char {
    ADD = '+',
    SUB = '-',
    MUL = '*',
    DIV = '/',
    MOD = '%',
    POW = '^'
};

// Simple discriminated union for token values
struct TokenVal {
    enum { T_DOUBLE, T_OP, T_STRING } tag;
    double d;
    EOp op;
    std::string s;

    TokenVal() : tag(T_DOUBLE), d(0.0) {}
    explicit TokenVal(double v) : tag(T_DOUBLE), d(v), op(EOp::ADD) {}
    explicit TokenVal(EOp v) : tag(T_OP), d(0.0), op(v) {}
    explicit TokenVal(const std::string& v) : tag(T_STRING), d(0.0), s(v) {}
};

struct Token {
    ETokenType type;
    TokenVal value;

    Token(ETokenType t, double v) : type(t), value(v) {}
    Token(ETokenType t, EOp v) : type(t), value(v) {}
    Token(ETokenType t, const std::string& v) : type(t), value(v) {}
    Token(ETokenType t, const char* v) : type(t), value(std::string(v)) {}

    double asNumber() const { return value.d; }
    EOp asOperator() const { return value.op; }
    const std::string& asString() const { return value.s; }
};

struct ErrorResult {
    bool hasError = false;
    std::string errorCode;
    std::string message;
};

struct CalcResult {
    double value = 0.0;
    bool isInfinity = false;
    ErrorResult error;
};
