/**
 * Reusable toggle switch with smooth accent-colored animation.
 *
 * Props:
 *   enabled  {boolean}  — current state
 *   onToggle {function} — callback when clicked
 *   id       {string}   — unique HTML id for testing
 */
export default function ToggleSwitch({ enabled, onToggle, id }) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500/30 ${
                enabled ? 'bg-accent-500' : 'bg-white/10'
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    )
}
