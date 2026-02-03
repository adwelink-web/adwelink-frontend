
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
    iconColor = "text-primary",
    badge,
    children,
    className = ""
}: WorkspaceHeaderProps) {
    return (
        <div className={`flex-none flex items-center justify-between z-10 ${className}`}>
            <div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {Icon && <Icon className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />}
                    {title}
                    {badge}
                </h2>
                {subtitle && (
                    <p className="text-muted-foreground text-xs hidden md:block">{subtitle}</p>
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
