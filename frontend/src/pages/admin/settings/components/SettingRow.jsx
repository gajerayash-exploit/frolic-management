/**
 * A single row inside a glass-card, showing a label on the left and
 * an action (toggle, badge, text) on the right.
 *
 * Props:
 *   label       {string}
 *   description {string|undefined}
 *   noBorder    {boolean} — omit bottom border on last row
 */
export default function SettingRow({ label, description, children, noBorder }) {
    return (
        <div className={`flex items-center justify-between py-4 ${noBorder ? '' : 'border-b border-white/5'}`}>
            <div className="pr-4">
                <p className="text-sm font-medium text-white">{label}</p>
                {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}
