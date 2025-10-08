import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PolicyCalculatorProps {
  onClose: () => void;
}

const PolicyCalculator = ({ onClose }: PolicyCalculatorProps) => {
  const [selectedAge, setSelectedAge] = useState<string>("20대");
  const [selectedGender, setSelectedGender] = useState<string>("남성");
  const [selectedLocation, setSelectedLocation] = useState<string>("서울");

  const impacts = [
    {
      title: "직접 영향도",
      badge: "매우 높음",
      badgeColor: "bg-red-500 hover:bg-red-500 text-white border-0",
      description: "방송문화협회 활동으로 표현의 자유와 언론 독립성에 직접적 영향을 미칩니다.",
      percentage: "-35%",
      detail: "표현 자유도",
      barColor: "bg-red-500"
    },
    {
      title: "장기적 영향도",
      badge: "높음",
      badgeColor: "bg-yellow-600 hover:bg-yellow-600 text-white border-0",
      description: "서울 거주 20대 여성으로 언론 소비 패턴과 정보 접근성에 주요 영향이 있을 수 있습니다.",
      percentage: "-18%",
      detail: "정보 다양성",
      barColor: "bg-yellow-600"
    },
    {
      title: "경제적 영향",
      badge: "보통",
      badgeColor: "bg-blue-500 hover:bg-blue-500 text-white border-0",
      description: "콘텐츠 산업 종사자 신뢰 하락과 관련 분야의 수익 감소 등 경제 기반에 재편을 가능성이 존재합니다.",
      percentage: "+12%",
      detail: "경제 규제",
      barColor: "bg-blue-500"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>
            <div>
              <h2 className="text-xl font-bold">정책 영향 계산기</h2>
              <p className="text-sm text-muted-foreground">
                이 정책이 나에게 미치는 영향을 확인해보세요
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* 사용자 정보 입력 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">연령</label>
              <div className="flex gap-2 flex-wrap">
                {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map((age) => (
                  <Button
                    key={age}
                    variant={selectedAge === age ? "default" : "outline"}
                    onClick={() => setSelectedAge(age)}
                    className="rounded-full"
                    size="sm"
                  >
                    {age}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">성별</label>
              <div className="flex gap-2">
                {["남성", "여성", "기타"].map((gender) => (
                  <Button
                    key={gender}
                    variant={selectedGender === gender ? "default" : "outline"}
                    onClick={() => setSelectedGender(gender)}
                    className="rounded-full"
                    size="sm"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">지역</label>
              <div className="flex gap-2 flex-wrap">
                {["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "기타"].map((location) => (
                  <Button
                    key={location}
                    variant={selectedLocation === location ? "default" : "outline"}
                    onClick={() => setSelectedLocation(location)}
                    className="rounded-full"
                    size="sm"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 영향도 결과 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {selectedAge} · {selectedGender} · {selectedLocation}
            </h3>

            {impacts.map((impact, index) => (
              <Card key={index} className="p-4 bg-muted/50 border-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{impact.title}</span>
                      <Badge className={impact.badgeColor}>
                        {impact.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {impact.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{impact.detail}</span>
                        <span className="font-bold">{impact.percentage}</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className={`h-full ${impact.barColor} transition-all`}
                          style={{ width: `${Math.abs(parseInt(impact.percentage))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                이 계산기는 일반적인 영향도를 추정한 것으로 개인의 상황에 따라 실제 영향은 다를 수 있습니다.
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PolicyCalculator;
