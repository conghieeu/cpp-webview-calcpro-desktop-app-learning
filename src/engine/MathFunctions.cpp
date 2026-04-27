#include "MathFunctions.hpp"
#include <cmath>
#include <algorithm>

double toRadians(double degrees) {
    return degrees * 3.14159265358979323846 / 180.0;
}

double toDegrees(double radians) {
    return radians * 180.0 / 3.14159265358979323846;
}

CalcResult applyMathFunction(const std::string& name, double arg, AngleUnit angleUnit) {
    auto err = [&](const std::string& code, const std::string& msg) -> CalcResult {
        return CalcResult{0, false, ErrorResult{true, code, msg}};
    };

    if (name == "sin") {
        double rad = (angleUnit == AngleUnit::DEGREES) ? toRadians(arg) : arg;
        return {std::sin(rad)};
    }
    if (name == "cos") {
        double rad = (angleUnit == AngleUnit::DEGREES) ? toRadians(arg) : arg;
        return {std::cos(rad)};
    }
    if (name == "tan") {
        double rad = (angleUnit == AngleUnit::DEGREES) ? toRadians(arg) : arg;
        // tan(90°), tan(270°) etc are undefined
        double cosv = std::cos(rad);
        if (std::abs(cosv) < 1e-12) {
            return err("UNDEFINED", "Undefined result");
        }
        return {std::tan(rad)};
    }
    if (name == "log") {
        if (arg <= 0) return err("INVALID_INPUT", "Logarithm of non-positive number");
        return {std::log10(arg)};
    }
    if (name == "ln") {
        if (arg <= 0) return err("INVALID_INPUT", "Logarithm of non-positive number");
        return {std::log(arg)};
    }
    if (name == "sqrt") {
        if (arg < 0) return err("INVALID_INPUT", "Square root of negative number");
        return {std::sqrt(arg)};
    }
    if (name == "cbrt") {
        return {std::cbrt(arg)};
    }

    return err("UNKNOWN_FUNCTION", "Unknown function: " + name);
}

CalcResult applyMathFunction2(const std::string& name, double arg1, double arg2) {
    if (name == "pow") {
        return {std::pow(arg1, arg2)};
    }
    return CalcResult{0, false, ErrorResult{true, "UNKNOWN_FUNCTION", "Unknown function: " + name}};
}
