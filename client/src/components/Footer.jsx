import { Footer } from "flowbite-react";
import { BsInstagram, BsTwitter, BsMailbox } from "react-icons/bs";
export default function FooterCom() {
  return (
    <Footer container className="border border-t-1 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="EAIREE blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsMailbox} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
