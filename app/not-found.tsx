import Link from "next/link";

export default function NotFound() {
  return (
    <div className="term-404">
      <div className="term-window">
        <div className="term-bar" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="term-body">
          <div>
            <span className="dim">$</span> curl -s https://priyanshu.dev{"<path>"}
          </div>
          <div className="err">error: 404 — route not found</div>
          <div className="dim">the page you requested does not exist or was moved.</div>
          <br />
          <div>
            <span className="dim">$</span>{" "}
            <Link href="/">cd ~ &nbsp;# back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
