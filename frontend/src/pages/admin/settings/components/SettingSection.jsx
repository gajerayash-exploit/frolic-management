/**
 * Wrapper for a group of related settings — renders a heading + children.
 *
 * Props:
 *   title       {string}            — section heading
 *   description {string|undefined}  — optional sub-text
 */
export default function SettingSection({ title, description, children }) {
    return (
        <div className="mb-8 last:mb-0">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
            </div>
            {children}
        </div>
    )
}
