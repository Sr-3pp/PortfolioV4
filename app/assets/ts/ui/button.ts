export default {
    slots: {
        base: [
            'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 relative isolate overflow-hidden',
            'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300/50'
        ]
    },
    variants: {
        color: {
            primary: 'rounded-full font-bold text-white border border-cyan-400/30 bg-gradient-to-r from-secondary-900 to-secondary-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.2)] hover:shadow-[0_0_24px_rgba(16,185,129,0.45)] active:shadow-[0_0_20px_rgba(16,185,129,0.35)]'
        }
    }
}
