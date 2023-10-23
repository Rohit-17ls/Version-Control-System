/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend : {
            colors : {
                'bg-color' : '#080808',
                'fg-color' : '#d8d4cf',
                'hover' : '#141414',
                'muted' : '#afa99e',
                'muted-light' : '#918f8bd9',
                'button' : '#3d3c3c',
                'error' : '#ef3434',
                'success' : '#62ed7f',
                'success-dark' : '#129f2f'
            },
            screens : {
                'sm-max' : {'min' : '0px', 'max' : '576px'},
                'lg-max' : {'min' : '576px', 'max' : '1152px'}
            },
            borderWidth : {
                '1' : '1px'
            }
        }
    },
    plugins: [],
  }