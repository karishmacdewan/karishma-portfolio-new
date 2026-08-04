export default function Layout({ children }: { children: React.ReactNode }) {
    /*     return (
        <div>
                    <Menu />

            {children}
        </div>
    ) */
    return <div className="dark:bg-black">{children}</div>;
}
