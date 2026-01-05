import React from 'react'

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen">
            {/* Ambient Background Effects - Global for all Workspace Pages */}
            <div className="fixed top-[-50px] left-[-50px] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px] pointer-events-none -z-10" />
            <div className="fixed top-[-50px] right-[-50px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />

            {/* Page Content */}
            <div className="relative z-0">
                {children}
            </div>
        </div>
    )
}
