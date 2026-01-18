
import React from 'react'

interface WorkspaceHeaderProps {
    title: string
    subtitle?: string
    icon?: React.ElementType
    iconColor?: string
    badge?: React.ReactNode
    children?: React.ReactNode
    className?: string
}

export function WorkspaceHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = "text-violet-500",
    badge,
    children,
    className = ""
}: WorkspaceHeaderProps) {
    return (
        <div className={`flex-none flex items-center justify-between z-10 ${className}`}>
            <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
                    {title}
                    {badge}
                </h2>
                {subtitle && (
                    <p className="text-muted-foreground text-xs">{subtitle}</p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    )
}
