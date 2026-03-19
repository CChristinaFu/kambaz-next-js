import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <FormControl className="wd-username mb-2" placeholder="username" defaultValue="ada" />
      <FormControl className="wd-password mb-2" placeholder="password" type="password" defaultValue="123" />
      <FormControl className="wd-password-verify mb-2" placeholder="verify password" type="password" />
      <Link href="/account/profile"
        className="btn btn-primary w-100 mb-2">
        Sign up
      </Link>
      <Link href="/account/signin">Sign in</Link>
    </div>
  );
}