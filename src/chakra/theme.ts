import {extendTheme} from "@chakra-ui/react"
import { Button } from "./button"
import "@fontsource/open-sans/300.css"
import "@fontsource/open-sans/400.css"
import "@fontsource/open-sans/700.css"

export const theme = extendTheme({
    colors: {
        brand: {
            100: "#2261A7",
        },
    },
    fonts: {
        body: "Open Sans, sans-serif"
    },
    styles: {
        global: () => ({
            body: {
                bg: "gray.200",
            }
        })
    },
    components: {
        Button,
    },
})