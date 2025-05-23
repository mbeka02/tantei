import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import type { AgentData } from "@/services/types";
import { formatTimeSince } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentData;
  compact?: boolean;
}

const AgentCard = ({ agent, compact = false }: AgentCardProps) => {
  const roi = agent.roi ?? 0;
  const isPositiveRoi = roi >= 0;
  const formattedRoi = roi.toFixed(2);

  return (
    <Link
      to="/app/agent/$id"
      params={{ id: agent._id }}
      className="block transition-all duration-200 hover:-translate-y-1"
    >
      <Card
        className={cn("overflow-hidden card-hover", compact ? "h-full" : "")}
      >
        <CardContent className={cn("p-5", compact ? "pb-2" : "")}>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "font-semibold truncate",
                      compact ? "text-base" : "text-lg",
                    )}
                  >
                    {agent.agent_name}
                  </h3>
                  {agent.risk_level === "low" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-200"
                    >
                      <Star className="h-3 w-3 mr-1 fill-blue-500 text-blue-500" />{" "}
                      Verified
                    </Badge>
                  )}
                </div>
                {/* <div className="flex items-center gap-1">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {agent.num_followers.toLocaleString()}
                </Badge>
              </div> */}
              </div>
              <p className="text-muted-foreground text-sm truncate">
                {agent.strategy_type}
              </p>
            </div>
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
              {agent.strategy_description}
            </p>
          )}

          <div
            className={cn(
              "grid gap-4",
              compact ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">ROI (30d)</p>
              <div className="flex items-center">
                {isPositiveRoi ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    "text-base font-medium",
                    isPositiveRoi ? "text-green-500" : "text-red-500",
                  )}
                >
                  {isPositiveRoi ? "+" : ""}
                  {formattedRoi}%
                </span>
              </div>
            </div>

            <div className="stats-card">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-base font-medium capitalize">
                  {agent.risk_level || "Moderate"}
                </span>
              </div>
            </div>

            {!compact && (
              <div className="stats-card">
                <p className="text-xs text-muted-foreground mb-1">
                  Subscription Fee
                </p>
                <span className="text-base font-medium">
                  {agent.subscription_fee} HBAR
                </span>
              </div>
            )}
          </div>

          <p className="mt-7 text-muted-foreground text-sm">
            Published {formatTimeSince(agent.time_created)}
          </p>
        </CardContent>

        <CardFooter
          className={cn(
            "px-5 py-3 bg-muted/30 flex justify-between",
            compact ? "mt-2" : "mt-",
          )}
        >
          <div className="text-sm text-muted-foreground">
            By {agent.owner_wallet_address.slice(0, 6)}...
            {agent.owner_wallet_address.slice(-4)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-medium cursor-pointer"
          >
            View Agent <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AgentCard;
