import type { Metadata } from 'next';
import { Readex_Pro } from 'next/font/google';
import './globals.tailwind.css';

const readexPro = Readex_Pro({
	subsets: ['latin'],
	variable: '--font-readex-pro',
});

export const metadata: Metadata = {
	title: 'Beat Store',
	description: 'A modern e-commerce app for selling beats',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en-GB">
			<body className={`${readexPro.variable} font-sans antialiased`}>
				{children}
			</body>
		</html>
	);
}
