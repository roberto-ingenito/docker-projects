import { ReactNode } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  navigationEnabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export default function ChartCard({
  title,
  subtitle,
  icon,
  children,
  navigationEnabled = false,
  onPrevious,
  onNext,
  isNextDisabled = false,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex-col sm:flex-row gap-3 pb-0 pt-6 px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">{icon}</div>
          <div>
            <h3 className="text-lg font-bold text-primary">{title}</h3>
            <p className="text-sm text-default-500">{subtitle}</p>
          </div>
        </div>
        {navigationEnabled && (
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={onPrevious}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={onNext} isDisabled={isNextDisabled}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
}
