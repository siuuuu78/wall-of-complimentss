import { Poppins } from "next/font/google";
import { Caveat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Wall of Compliments",
  description: "Kirim dan baca pesan positif",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${caveat.variable} bg-[#FAEBD7] text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
