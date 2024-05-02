import CheckoutHeader from '../../components/CheckoutHeader.tsx'
import Footer from '../../components/Footer'

interface Props {
    children?: React.ReactNode
}

export default function CheckoutLayout({ children }: Props) {
    return (
        <div>
            <div>
                <CheckoutHeader />
                {children}
                <Footer />
            </div>
        </div>
    )
}