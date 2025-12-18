import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  status: "pending" | "success" | "error";
  title: string;
  description?: string;
  error?: string;
}

export function TransactionStatus({
  isOpen,
  onClose,
  txHash,
  status,
  title,
  description,
  error
}: TransactionStatusProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      onClose();
    }
  }, [status, countdown, onClose]);

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending": return "bg-blue-500/10 border-blue-500/20";
      case "success": return "bg-green-500/10 border-green-500/20";
      case "error": return "bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`flex flex-col items-center p-6 rounded-lg border ${getStatusColor()}`}>
            {getStatusIcon()}
            
            <div className="text-center mt-4">
              <Badge variant={status === "error" ? "destructive" : "default"}>
                {status === "pending" && "Transaction Pending"}
                {status === "success" && "Transaction Confirmed"}
                {status === "error" && "Transaction Failed"}
              </Badge>
              
              {description && (
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
              )}
              
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
          </div>

          {txHash && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
                <span className="truncate">{txHash}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://polygonscan.com/tx/${txHash}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {status === "success" && (
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close {countdown > 0 && `(${countdown})`}
              </Button>
            )}
            {status === "error" && (
              <Button className="flex-1" onClick={onClose}>
                Close
              </Button>
            )}
            {status === "pending" && (
              <Button variant="outline" className="flex-1" disabled>
                Please wait...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}