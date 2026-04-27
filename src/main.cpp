#include <iostream>
#include <nlohmann/json.hpp>
#include "webview/webview.h"
#include "index_html.h"
#include "bridge/Bridge.hpp"

using json = nlohmann::json;

#ifdef _WIN32
int WINAPI WinMain(HINSTANCE /*hInst*/, HINSTANCE /*hPrevInst*/,
                   LPSTR /*lpCmdLine*/, int /*nCmdShow*/) {
#else
int main() {
#endif
    try {
        Calculator calculator;
        Bridge bridge(calculator);

        webview::webview main_window(false, nullptr);
        main_window.set_title("CalcPro");
        main_window.set_size(400, 680, WEBVIEW_HINT_NONE);

        main_window.bind("calculate", [&](const std::string& args_str) -> std::string {
            return bridge.handleMessage("calculate", args_str);
        });

        main_window.bind("memoryOp", [&](const std::string& args_str) -> std::string {
            return bridge.handleMessage("memory", args_str);
        });

        main_window.bind("setAngleUnit", [&](const std::string& args_str) -> std::string {
            return bridge.handleMessage("angleUnit", args_str);
        });

        main_window.set_html(INDEX_HTML);
        main_window.run();
    } catch (const webview::exception &e) {
        std::cerr << e.what() << '\n';
        return 1;
    }

    return 0;
}
