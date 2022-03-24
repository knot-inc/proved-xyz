interface BtnProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
}

export const GradientBtn = ({ children, disabled, onClick }: BtnProps) => {
  return (
    <div className="">
      <button
        onClick={onClick}
        className="p-[2px] bg-gradient-to-r from-[#F8BCFF] via-[#9A96FF] to-[#A7DCFF] rounded-full disabled:opacity-50 text-white disabled:text-gray-500"
        disabled={disabled}
      >
        <div className="px-6 py-3 text-base font-medium rounded-full bg-proved-500 hover:bg-proved-100 ">
          {children}
        </div>
      </button>
    </div>
  );
};
