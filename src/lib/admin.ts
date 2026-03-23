export const ADMIN_EMAILS = [
    "lgumbi2169@gmail.com",
    "luazii@hazelnailz.co.za", // Placeholder if it's an email
];

export const isUserAdmin = (user: any) => {
    if (!user) return false;
    
    const email = user.primaryEmailAddress?.emailAddress;
    const username = user.username?.toLowerCase();
    
    return (
        ADMIN_EMAILS.includes(email) || 
        username?.includes("luazii") || 
        email?.includes("luazii")
    );
};
