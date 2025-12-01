// resources/js/app.tsx
import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

const appName = import.meta.env.VITE_APP_NAME || "SPK";

// Component untuk handle flash messages
function FlashMessages() {
    useEffect(() => {
        // Listen untuk event page load dari Inertia
        const removeListener = router.on("success", (event) => {
            const flash = event.detail.page.props.flash;

            if (flash?.success) {
                toast.success(flash.success);
            }

            if (flash?.error) {
                toast.error(flash.error);
            }

            if (flash?.info) {
                toast.info(flash.info);
            }

            if (flash?.warning) {
                toast.warning(flash.warning);
            }
        });

        return () => {
            removeListener();
        };
    }, []);

    return null;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <FlashMessages />
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
