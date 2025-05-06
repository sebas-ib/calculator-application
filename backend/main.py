import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/mortgage', methods=['POST'])
def mortgage():
    try:
        data = request.json
        home_price = float(data['homePrice'])
        down_payment = float(data['downPayment'])
        interest = float(data['interest'])
        years = int(data['years'])
        tax_rate = float(data['taxRate'])
        insurance = float(data['insurance'])
        hoa = float(data['hoa'])

        loan_amount = home_price - down_payment
        r = interest / 100 / 12
        n = years * 12
        monthly_loan_payment = (loan_amount * r) / (1 - (1 + r) ** -n)
        monthly_tax = (tax_rate / 100 * home_price) / 12
        monthly_insurance = insurance / 12
        monthly_hoa = hoa
        total_monthly = monthly_loan_payment + monthly_tax + monthly_insurance + monthly_hoa

        return jsonify({
            'loanPayment': monthly_loan_payment,
            'tax': monthly_tax,
            'insurance': monthly_insurance,
            'hoa': monthly_hoa,
            'total': total_monthly
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/income-tax', methods=['POST'])
def income_tax():
    try:
        data = request.json
        filing_status = data['filingStatus']
        income = float(data['income'])
        other_income = float(data['otherIncome'])
        deductions = float(data['deductions'])
        tax_credits = float(data['taxCredits'])

        if income < 0 or other_income < 0 or deductions < 0 or tax_credits < 0:
            return jsonify({'error': 'All inputs must be non-negative.'}), 400

        gross_income = income + other_income
        taxable_income = max(gross_income - deductions, 0)

        brackets = {
            "single": [
                (11000, 0.10),
                (44725, 0.12),
                (95375, 0.22),
                (182100, 0.24),
                (231250, 0.32),
                (578125, 0.35),
                (float('inf'), 0.37),
            ],
            "married": [
                (22000, 0.10),
                (89450, 0.12),
                (190750, 0.22),
                (364200, 0.24),
                (462500, 0.32),
                (693750, 0.35),
                (float('inf'), 0.37),
            ]
        }

        selected_brackets = brackets["married" if filing_status == "married" else "single"]

        tax = 0
        prev = 0
        for limit, rate in selected_brackets:
            if taxable_income > limit:
                tax += (limit - prev) * rate
                prev = limit
            else:
                tax += (taxable_income - prev) * rate
                break

        tax = max(tax - tax_credits, 0)
        effective_rate = (tax / gross_income) * 100 if gross_income > 0 else 0

        return jsonify({
            'totalTax': round(tax, 2),
            'effectiveRate': round(effective_rate, 2),
            'grossIncome': gross_income,
            'taxableIncome': taxable_income
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/401k', methods=['POST'])
def retirement_401k():
    try:
        data = request.json
        current_balance = float(data['currentBalance'])
        contribution = float(data['contribution'])
        years = int(data['years'])
        annual_return = float(data['returnRate'])
        salary = float(data['salary'])
        match_percent = float(data['matchPercent'])  # e.g., 50%
        max_match_percent = float(data['maxMatchPercent'])  # e.g., 6%

        if any(val < 0 for val in [
            current_balance, contribution, years, annual_return, salary, match_percent, max_match_percent
        ]):
            return jsonify({'error': 'All inputs must be non-negative.'}), 400

        months = years * 12
        r = (annual_return / 100) / 12

        monthly_max_match = (max_match_percent / 100) * salary / 12
        employer_match = min(contribution, monthly_max_match) * (match_percent / 100)

        future_value_contributions = (contribution + employer_match) * (((1 + r) ** months - 1) / r)
        future_value_existing = current_balance * ((1 + r) ** months)
        total_future_value = future_value_contributions + future_value_existing

        return jsonify({
            'futureValue': total_future_value,
            'fromContributions': future_value_contributions,
            'fromCurrentBalance': future_value_existing,
            'employerMatchMonthly': employer_match
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    static_folder = os.path.join(os.getcwd(), 'frontend', 'out')
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
