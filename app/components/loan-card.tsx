import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateAmortizedLoan } from "@/lib/utils";
import { useState } from "react";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Form, useNavigation } from "@remix-run/react";

export function LoanCard() {
  /************* loan logic *********** */
  const maxLoan = 35000,
    minLoan = 4000;
  const [loanSlider, setLoanSlider] = useState(maxLoan);
  const [loanInput, setLoanInput] = useState(maxLoan);

  function handleLoanSliderChange(loan: number) {
    setLoanSlider(loan);
    setLoanInput(loan);
  }
  function onLoanInputBlur(loan: number) {
    if (loan >= minLoan && loan <= maxLoan) {
      handleLoanSliderChange(loan);
    }

    if (loan > maxLoan) {
      handleLoanSliderChange(maxLoan);
    }
    if (loan < minLoan) {
      handleLoanSliderChange(minLoan);
    }
  }
  /**************months logic ********** */
  const maxMonths = 60,
    minMonths = 12;
  const [monthsSlider, setMonthsSlider] = useState(minMonths);
  const [monthsInput, setMonthsInput] = useState(minMonths);
  const dateOfReturn = format(addMonths(new Date(), monthsSlider), "d 'de' MMMM 'de' y", { locale: es });

  function handleMonthsSliderChange(month: number) {
    setMonthsSlider(month);
    setMonthsInput(month);
  }
  function onMonthsInputBlur(month: number) {
    if (month >= minMonths && month <= maxMonths) {
      handleMonthsSliderChange(month);
    }

    if (month > maxMonths) {
      handleMonthsSliderChange(maxMonths);
    }
    if (month < minMonths) {
      handleMonthsSliderChange(minMonths);
    }
  }
  /***********calculate loan************ */
  const { monthlyPayment, total, totalInterest } = calculateAmortizedLoan(loanSlider, 12.9, monthsSlider);
  /**********optimist ui************* */
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/?index";
  console.log(navigation);

  return (
    <Form method="post">
      <Card>
        <CardHeader>
          <CardTitle>Personal loan simulator</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <LoanField
              loanInput={loanInput}
              loanSlider={loanSlider}
              handleLoanSliderChange={handleLoanSliderChange}
              setLoanInput={setLoanInput}
              onLoanInputBlur={onLoanInputBlur}
            />
            <MonthsField
              monthsInput={monthsInput}
              monthsSlider={monthsSlider}
              handleMonthsSliderChange={handleMonthsSliderChange}
              onMonthsInputBlur={onMonthsInputBlur}
              setMonthsInput={setMonthsInput}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-2xl">Monthly quota</p>
              <div className="text-right">
                <p className="text-2xl">
                  {monthlyPayment} &euro;<span className="text-sm">/month</span>
                </p>
                <input type="hidden" name="monthlyQuota" value={monthlyPayment} />
                <span className="text-sm font-medium text-muted-foreground"> Total due {total} &euro;</span>
                <input type="hidden" name="total" value={total} />
              </div>
            </div>
            <Separator />
            <div className="grid gap-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <p>Inetest</p>
                <span className="font-bold">{totalInterest} &euro;</span>
                <input type="hidden" name="interest" value={totalInterest} />
              </div>
              <div className="flex justify-between">
                <p>Amount of the loan</p>
                <span className="font-bold">{loanSlider} &euro;</span>
              </div>
              <div className="flex justify-between">
                <p>Date of return</p>
                <time className="font-medium">{dateOfReturn}</time>
                <input type="hidden" name="dateOfReturn" value={dateOfReturn} />
              </div>
              <div className="flex justify-between">
                <p>TIN 12,90%</p>
                <time className="font-medium">Commission opening 0.00&euro;</time>
              </div>
              <div className="flex justify-between">
                <p>TAE 13,69%</p>
                <time className="font-medium">Study Committee 0.00&euro;</time>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled={isSubmitting} type="submit" isFullWidth className="font-bold">
            {isSubmitting ? "Loading..." : "Start"}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
function LoanField({ loanSlider, handleLoanSliderChange, loanInput, onLoanInputBlur, setLoanInput }: Record<string, any>) {
  return (
    <div className="flex flex-col gap-y-4 md:gap-y-0">
      <Label htmlFor="loan">How much you need?</Label>
      <div className="grid gap-4 md:grid-cols-4">
        <Slider id="loan" name="loan" className="col-span-3" value={[loanSlider]} step={500} min={4000} max={35000} onValueChange={(value) => handleLoanSliderChange(value[0])} />
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="w-28 text-center md:w-full"
            value={loanInput}
            onBlur={(e) => onLoanInputBlur(Number(e.target.value))}
            onChange={(e) => setLoanInput(Number(e.target.value))}
          />
          <span>&euro;</span>
        </div>
      </div>
    </div>
  );
}
function MonthsField({ monthsSlider, monthsInput, handleMonthsSliderChange, onMonthsInputBlur, setMonthsInput }: Record<string, any>) {
  return (
    <div className="flex flex-col gap-y-4 md:gap-0">
      <Label htmlFor="months">How many months?</Label>
      <div className="grid gap-4 md:grid-cols-4">
        <Slider
          id="months"
          name="months"
          className="md:col-span-3"
          step={6}
          value={[monthsSlider]}
          min={12}
          max={60}
          onValueChange={(value) => handleMonthsSliderChange(value[0])}
        />
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="w-28 text-center md:w-full"
            value={monthsInput}
            onBlur={(e) => onMonthsInputBlur(Number(e.target.value))}
            onChange={(e) => setMonthsInput(Number(e.target.value))}
          />
          <span>months</span>
        </div>
      </div>
    </div>
  );
}
