interface TicketInfoProps {
  orgname?: string;
  prover?: string;
  role?: string;
}
const formatText = (text: string) => {
  const splits = text.split(" ");
  if (splits.length === 0) return text;
  let format = "";
  const arr: string[] = [];
  for (const word of splits) {
    format = format.concat(`${word} `);
    if (format.length > 15) {
      arr.push(format);
      format = "";
    }
  }
  if (format.length > 0) {
    arr.push(format);
  }
  return (
    <>
      {arr.map((w) => (
        <p key={w}>{w}</p>
      ))}
    </>
  );
};
export default function TicketInfo({
  orgname = "Unknown Org",
  prover,
  role = "Unknown Role",
}: TicketInfoProps) {
  const isLongOrg = orgname?.length || 0 > 20;
  const isLongRole = role?.length || 0 > 20;

  const orgFormatName = isLongOrg ? formatText(orgname) : orgname;
  const roleFormatName = isLongRole ? formatText(role) : role;
  return (
    <div className="flex flex-col justify-between space-y-2">
      <div>
        <div className="text-xs font-semibold text-purple-200">ORG</div>
        <div
          className={`font-extralight ${
            isLongOrg ? "text-xs " : "text-sm sm:text-lg "
          } `}
        >
          {orgFormatName}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-purple-200">ROLE</div>
        <div
          className={`${
            isLongRole ? "text-xs " : "text-sm sm:text-lg"
          } font-extralight`}
        >
          {roleFormatName}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-purple-200">PROVED BY</div>
        <div className="text-sm sm:ext-lg font-extralight">
          {prover || "Prover Name"}
        </div>
      </div>
    </div>
  );
}
