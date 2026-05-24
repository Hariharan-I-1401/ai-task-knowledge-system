class ScoringService:
    @staticmethod
    def calculate_deal_score(mrr: float, funding_ask: float, stage: str) -> float:
        """
        Calibrates an internal deal score indexing calculation between 0.0 and 100.0.
        Evaluates financial ratios, operational scale metrics, and growth profiles.
        """
        score = 50.0  # Safe structural mid-line starting point

        # 1. Evaluate Traction Scaling Weights (Max add-on: +30 points)
        if mrr > 25000:
            score += 30
        elif mrr > 10000:
            score += 20
        elif mrr > 2500:
            score += 10

        # 2. Capital Efficiency Audit (Preventing zero-division flags)
        if funding_ask > 0:
            mrr_to_ask_ratio = (mrr * 12) / funding_ask
            if mrr_to_ask_ratio >= 0.20:
                score += 10
            elif mrr_to_ask_ratio < 0.05:
                score -= 10
        else:
            score -= 5  # Mark down if funding request profile data is unstructured

        # 3. Development Stage Calibration Multipliers
        stage_weights = {
            "Growth Stage": 10,
            "Early Revenue Lifecycle": 5,
            "MVP Complete": 0,
            "Idea": -5
        }
        score += stage_weights.get(stage, 0)

        # Enforce strict boundary caps so values never overflow formatting scales
        return max(0.0, min(100.0, round(score, 1)))

scoring_service = ScoringService()