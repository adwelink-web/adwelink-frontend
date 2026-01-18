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
        <div className="h-full w-full overflow-hidden flex flex-col relative">
            <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar relative z-10">
                <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#0B0F19]/80 px-4 md:px-8 py-4 mb-2">
                    <WorkspaceHeader
                        title="Billing & Revenue"
                        subtitle="Track subscriptions and payment history"
                        icon={CreditCard}
                        iconColor="text-amber-500"
                        className="max-w-7xl mx-auto"
                    />
                </div>

                <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                    {payments.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-amber-500/5 to-transparent rounded-3xl border border-white/10 border-dashed">
                            <Wallet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">No payments recorded</h3>
                            <p className="text-muted-foreground text-sm">Revenue data will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map(payment => (
                                <Card key={payment.id} className="bg-white/5 border-white/10">
                                    <CardHeader className="flex flex-row items-center justify-between py-4">
                                        <div>
                                            <CardTitle className="text-base text-white">{payment.institutes?.name || 'Unknown Client'}</CardTitle>
                                            <CardDescription>{new Date(payment.payment_date || payment.created_at || new Date()).toLocaleDateString()}</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-white">
                                                {payment.currency} {payment.amount}
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
