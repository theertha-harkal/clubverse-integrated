const imgClubverseLogo = "https://www.figma.com/api/mcp/asset/e156e9ae-a197-43a8-b596-e2c4329b737b.png";
const imgContainer = "https://www.figma.com/api/mcp/asset/287891db-a0a0-49ff-adde-45ff9be41f6c.svg";
const imgContainer1 = "https://www.figma.com/api/mcp/asset/1ceb1798-0693-4ff8-9522-c22b483f3e37.svg";
const imgContainer2 = "https://www.figma.com/api/mcp/asset/661677cd-819b-4091-8f7c-8d3ecb8fdff9.svg";
const imgContainer3 = "https://www.figma.com/api/mcp/asset/e04a623c-0926-4378-b303-af53a79b5f74.svg";
const imgContainer4 = "https://www.figma.com/api/mcp/asset/6a5c2978-4ae0-4f9d-8c70-76df42a148df.svg";

export default function Onboarding({ go }) {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full" data-node-id="3590:2" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Onboarding">
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between max-w-[448px] min-h-[884px] p-[16px] relative w-full" data-node-id="3590:3" data-name="Main">
        <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-node-id="3590:4" data-name="Header / Logo Area:margin">
          <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="3590:5" data-name="Header / Logo Area">
            <div className="content-stretch flex flex-col h-[104px] items-start pb-[8px] relative shrink-0 w-[96px]" data-node-id="3590:6" data-name="Margin">
              <div className="bg-[#f8f9ff] content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[16px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] shrink-0 size-[96px]" data-node-id="3590:7" data-name="Background+Shadow">
                <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="3590:8" data-name="Clubverse Logo">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgClubverseLogo} />
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-node-id="3590:9" data-name="Margin">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="3590:10" data-name="Container">
                <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="3590:11" data-name="Heading 1">
                  <div className="[word-break:break-word] flex flex-col font-['Hanken_Grotesk:ExtraBold'] font-extrabold justify-center leading-[0] relative shrink-0 text-[#4648d4] text-[48px] text-center tracking-[-1.2px] whitespace-nowrap" data-node-id="3590:12">
                    <p className="leading-[56px]">Clubverse</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="3590:13" data-name="Container">
                  <div className="[word-break:break-word] flex flex-col font-['Hanken_Grotesk:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#464554] text-[20px] text-center whitespace-nowrap" data-node-id="3590:14">
                    <p className="leading-[28px]">Your campus. Your community.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px py-[32px] relative w-full" data-node-id="3590:15" data-name="Section - Onboarding Cards (Bento style grid on mobile):margin">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px relative w-full" data-node-id="3590:16" data-name="Section - Onboarding Cards (Bento style grid on mobile)">
            <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__140px_116px] relative shrink-0 w-full" data-node-id="3590:17" data-name="Container">
              <div className="bg-[#f8f9ff] col-1 content-stretch drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-self-stretch p-[16px] relative rounded-[24px] row-1 self-start shrink-0" data-node-id="3590:18" data-name="Card 1">
                <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px]" data-node-id="3590:19" data-name="Margin">
                  <div className="bg-[#e1e0ff] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-node-id="3590:20" data-name="Background">
                    <div className="relative shrink-0 size-[20px]" data-node-id="3590:21" data-name="Container">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-center pl-[17.56px] pr-[17.58px] relative shrink-0" data-node-id="3590:23" data-name="Heading 3">
                  <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0d1c2e] text-[16px] text-center whitespace-nowrap" data-node-id="3590:24">
                    <p className="leading-[24px] mb-0">Talk</p>
                    <p className="leading-[24px]">anonymously</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8f9ff] col-2 content-stretch drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-self-stretch p-[16px] relative rounded-[24px] row-1 self-start shrink-0" data-node-id="3590:25" data-name="Card 2">
                <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px]" data-node-id="3590:26" data-name="Margin">
                  <div className="bg-[#6cf8bb] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-node-id="3590:27" data-name="Background">
                    <div className="relative shrink-0 size-[20px]" data-node-id="3590:28" data-name="Container">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer1} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-center px-[19.81px] relative shrink-0" data-node-id="3590:30" data-name="Heading 3">
                  <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0d1c2e] text-[16px] text-center whitespace-nowrap" data-node-id="3590:31">
                    <p className="leading-[24px] mb-0">Discover</p>
                    <p className="leading-[24px]">communities</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8f9ff] col-1 content-stretch drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-self-stretch p-[16px] relative rounded-[24px] row-2 self-start shrink-0" data-node-id="3590:32" data-name="Card 3">
                <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px]" data-node-id="3590:33" data-name="Margin">
                  <div className="bg-[#ffddb8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-node-id="3590:34" data-name="Background">
                    <div className="h-[20px] relative shrink-0 w-[18px]" data-node-id="3590:35" data-name="Container">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer2} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0d1c2e] text-[16px] text-center whitespace-nowrap" data-node-id="3590:37">
                  <p className="leading-[24px]">Join events</p>
                </div>
              </div>
              <div className="bg-[#f8f9ff] col-2 content-stretch drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-self-stretch p-[16px] relative rounded-[24px] row-2 self-start shrink-0" data-node-id="3590:38" data-name="Card 4">
                <div className="content-stretch flex flex-col h-[60px] items-start pb-[12px] relative shrink-0 w-[48px]" data-node-id="3590:39" data-name="Margin">
                  <div className="bg-[#d5e3fc] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-node-id="3590:40" data-name="Background">
                    <div className="h-[21px] relative shrink-0 w-[16px]" data-node-id="3590:41" data-name="Container">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer3} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0d1c2e] text-[16px] text-center whitespace-nowrap" data-node-id="3590:43">
                  <p className="leading-[24px]">Earn rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-node-id="3590:44" data-name="Footer - CTA Area:margin">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="3590:45" data-name="Footer - CTA Area">
            <button onClick={() => go && go("login")} className="bg-[#4648d4] content-stretch flex gap-[12px] items-center justify-center py-[24px] relative rounded-[12px] shrink-0 w-full cursor-pointer" data-node-id="3590:46" data-name="Button">
              <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-node-id="3590:47" data-name="Button:shadow" />
              <div className="h-[18px] relative shrink-0 w-[22px]" data-node-id="3590:48" data-name="Container">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer4} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Hanken_Grotesk:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-center text-white whitespace-nowrap" data-node-id="3590:50">
                <p className="leading-[28px]">Continue with College Email</p>
              </div>
            </button>
            <div className="[word-break:break-word] font-['Inter:Regular'] font-normal h-[40px] leading-[0] not-italic relative shrink-0 text-[14px] text-center w-full whitespace-nowrap" data-node-id="3590:51" data-name="Container">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center left-[calc(50%-24.51px)] text-[#464554] top-[9.5px]" data-node-id="3590:52">
                <p>
                  <span className="leading-[20px]">{`By continuing, you agree to our `}</span>
                  <span className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[20px] not-italic text-[#4648d4]">Terms</span>
                  <span className="leading-[20px]">{` & `}</span>
                </p>
              </div>
              <div className="-translate-x-1/2 absolute h-[37px] left-[calc(50%+69.61px)] text-[#4648d4] top-px w-[178.89px]" data-node-id="3590:53" data-name="Link">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center left-[calc(50%+64.94px)] top-[8.5px]" data-node-id="3590:54">
                  <p className="leading-[20px]">Privacy</p>
                </div>
                <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center left-[calc(50%-69.63px)] top-[28.5px]" data-node-id="3590:55">
                  <p className="leading-[20px]">Policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
