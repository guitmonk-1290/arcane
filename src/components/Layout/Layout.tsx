import React from 'react';
import Navbar from "../Navbar/Navbar"

interface Props {
    children: React.ReactNode;
}

const Layout:React.FC<Props> = ({ children }) => {
    
    return (
        <>
            <Navbar />
            <main style={{ 
                minWidth: '280px',
                marginTop: '44px'
            }}>
                {children}
            </main>
        </>
    )
}
export default Layout;