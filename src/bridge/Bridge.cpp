#include "Bridge.hpp"
#include <nlohmann/json.hpp>
#include <sstream>

using json = nlohmann::json;

Bridge::Bridge(Calculator& calculator) : m_calc(calculator) {}

std::string Bridge::handleMessage(const std::string& action, const std::string& jsonArgs) {
    try {
        if (action == "calculate") {
            auto args = json::parse(jsonArgs);
            std::string expr = args[0].get<std::string>();
            std::string angleUnit = "degrees";
            if (args.size() > 1) angleUnit = args[1].get<std::string>();
            return handleCalculate(expr, angleUnit);
        } else if (action == "memory") {
            auto args = json::parse(jsonArgs);
            std::string op = args[0].get<std::string>();
            double val = (args.size() > 1) ? args[1].get<double>() : 0.0;
            return handleMemory(op, val);
        } else if (action == "angleUnit") {
            auto args = json::parse(jsonArgs);
            std::string unit = args[0].get<std::string>();
            return handleAngleUnit(unit);
        } else {
            json err = {{"type", "error"}, {"code", "UNKNOWN_ACTION"}, {"message", "Unknown action: " + action}};
            return err.dump();
        }
    } catch (const std::exception& e) {
        json err = {{"type", "error"}, {"code", "BRIDGE_ERROR"}, {"message", e.what()}};
        return err.dump();
    }
}

std::string Bridge::handleCalculate(const std::string& expression, const std::string& angleUnit) {
    m_calc.setAngleUnit(angleUnit == "radians" ? AngleUnit::RADIANS : AngleUnit::DEGREES);
    auto result = m_calc.calculate(expression);

    if (result.error.hasError) {
        json resp = {
            {"type", "error"},
            {"code", result.error.errorCode},
            {"message", result.error.message}
        };
        return resp.dump();
    }

    // Format the value - use integer display when exact
    std::string display;
    double intpart;
    if (std::modf(result.value, &intpart) == 0.0 && std::abs(result.value) < 1e15) {
        std::ostringstream ss;
        ss.precision(15);
        ss << (long long)result.value;
        display = ss.str();
    } else {
        std::ostringstream ss;
        ss.precision(10);
        ss << result.value;
        display = ss.str();
        // Remove trailing zeros
        auto dot = display.find('.');
        if (dot != std::string::npos) {
            auto last = display.find_last_not_of('0');
            if (last > dot) display = display.substr(0, last + 1);
            else display = display.substr(0, dot);
        }
    }

    json resp = {
        {"type", "result"},
        {"value", display},
        {"fullValue", result.value}
    };
    return resp.dump();
}

std::string Bridge::handleMemory(const std::string& operation, double value) {
    if (operation == "store") m_calc.memoryStore(value);
    else if (operation == "add") m_calc.memoryAdd(value);
    else if (operation == "sub") m_calc.memorySub(value);
    else if (operation == "recall") { /* nothing */ }
    else if (operation == "clear") m_calc.memoryClear();

    json resp = {
        {"type", "memory"},
        {"value", m_calc.memoryRecall()},
        {"hasValue", m_calc.hasMemory()}
    };
    return resp.dump();
}

std::string Bridge::handleAngleUnit(const std::string& unit) {
    AngleUnit au = (unit == "radians") ? AngleUnit::RADIANS : AngleUnit::DEGREES;
    m_calc.setAngleUnit(au);
    json resp = {{"type", "angleUnit"}, {"unit", unit}};
    return resp.dump();
}

std::string Bridge::escapeJson(const std::string& s) {
    json j = s;
    return j.dump();
}
