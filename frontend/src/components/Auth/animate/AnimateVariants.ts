
export const AnimateVariants = {
    PageVariants:   { 
        initial: {
            y: '5vh',
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
        },
        in: {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
            type: 'tween',
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 1.2,
            }
        },
        out: {
            opacity: 0,
            scale: 0.98,
            filter: 'blur(5px)',
            transition: {
            type: 'tween',
            ease: [0.55, 0.085, 0.68, 0.53],
            duration: 0.6
            }
        }
    },
    startSplashVariants:  {
        initial: {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            background: 'rgba(58, 58, 59, 0)'
        },
        in: {
            opacity: 1,
            backdropFilter: 'blur(20px)',
            background: 'rgba(58, 58, 59, 7)',
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        },
        out: {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            background:'rgba(58, 58, 59, 0)',
            transition: {
                duration: 0.5,
                ease: 'easeIn'
            }
        }
    },
    startTextVariants: {
        initial: { 
            opacity: 0,
            width: 0 
        },
        in: { 
            opacity: 1,
            width: "auto",
            transition: {
            width: {
                duration: 1.5,
                ease: [0.9, 0, 0.3, 1]
            },
            opacity: {
                duration: 0.3,
                ease: "easeOut"
            }
            }
        },
        out: {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)",
            transition: {
            duration: 0.5,
            ease: "easeIn"
            }
        }
        }
} as const