// Super Admin utility functions

// List of super admin emails
export const SUPER_ADMIN_EMAILS = [
    "thekashidasmongre@gmail.com",
    "adwelink@gmail.com",
];

// Check if user is super admin
export function isSuperAdmin(email: string | undefined | null): boolean {
    if (!email) return false;

    // Check exact email match
    if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
        return true;
    }

    // Check @adwelink.com domain
    if (email.toLowerCase().endsWith("@adwelink.com")) {
        return true;
    }

    return false;
}
