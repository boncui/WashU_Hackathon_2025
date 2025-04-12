import type React from "react"
interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="relative mx-auto">
      {/* Phone frame */}
      <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-xl flex justify-center">
          <div className="w-20 h-4 bg-black rounded-b-xl"></div>
        </div>

        {/* Content */}
        <div className="w-full h-full overflow-hidden bg-[#121212] text-white">{children}</div>
      </div>
    </div>
  )
}
