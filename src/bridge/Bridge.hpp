#pragma once
#include <string>
#include <functional>
#include "engine/Calculator.hpp"

class Bridge {
public:
    explicit Bridge(Calculator& calculator);

    std::string handleMessage(const std::string& action, const std::string& jsonArgs);

private:
    Calculator& m_calc;

    std::string handleCalculate(const std::string& expression, const std::string& angleUnit);
    std::string handleMemory(const std::string& operation, double value);
    std::string handleAngleUnit(const std::string& unit);

    static std::string escapeJson(const std::string& s);
};
