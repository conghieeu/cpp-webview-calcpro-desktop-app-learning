#pragma once
#include <string>
#include "Token.hpp"

enum class AngleUnit { DEGREES, RADIANS };

CalcResult applyMathFunction(const std::string& name, double arg, AngleUnit angleUnit);
CalcResult applyMathFunction2(const std::string& name, double arg1, double arg2);
double toRadians(double degrees);
double toDegrees(double radians);
