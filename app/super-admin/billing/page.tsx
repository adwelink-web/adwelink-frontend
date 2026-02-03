/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase-server"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Download } from "lucide-react"
import { WorkspaceHeader } from "@/components/workspace-header"

async function getPayments() {
    const supabase = createAdminClient()
    const { data: payments } = await supabase
        .from("payments")
        .select(`*, institutes(name)`)
        .order("created_at", { ascending: false })
    return payments || []
}

export default async function BillingPage() {
    const payments = await getPayments()

    return (
        <div className="h-[calc(100vh-45px)] w-full overflow-hidden flex flex-col relative">
            {/* Header Section - Fixed (Non-scrollable) */}
            <div className="flex-none pt-4 px-4 md:px-8 pb-2">
                <WorkspaceHeader
                    title="Billing & Revenue"
                    subtitle="Track subscriptions and payment history"
                    icon={CreditCard}
                    iconColor="text-primary"
                    className="max-w-7xl mx-auto w-full"
                />
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 min-h-0 flex flex-col px-4 md:px-8 pb-4 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">
                <div className="w-full pt-2 pb-10">
                    {payments.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl border border-border border-dashed">
                            <Wallet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No payments recorded</h3>
                            <p className="text-muted-foreground text-sm">Revenue data will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map(payment => (
                                <Card key={payment.id} className="bg-card/50 border-border">
                                    <CardHeader className="flex flex-row items-center justify-between py-4">
                                        <div>
                                            <CardTitle className="text-base text-foreground">{payment.institutes?.name || 'Unknown Client'}</CardTitle>
                                            <CardDescription>{new Date(payment.payment_date || payment.created_at || new Date()).toLocaleDateString()}</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-foreground">
                                                ₹ {payment.amount}
                                            </div>
                                            <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                                {payment.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
