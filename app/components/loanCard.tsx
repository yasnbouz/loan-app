import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateLoan } from "@/lib/utils";
import { useState } from "react";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Form, useNavigation } from "@remix-run/react";

export function LoanCard() {
  /************* loan logic *********** */
  const minPrincipal = 4000;
  const maxPrincipal = 35000;
  const minRate = 4.5 / 100;
  const maxRate = 9.45 / 100;

  const [loanSlider, setLoanSlider] = useState(maxPrincipal);
  const [loanInput, setLoanInput] = useState(maxPrincipal);

  // Calculate the interest rate based on the principal
  const interestRate = ((maxPrincipal - loanSlider) / (maxPrincipal - minPrincipal)) * (maxRate - minRate) + minRate;
  const TIN = Number(interestRate * 100).toFixed(2);

  function handleLoanSliderChange(loan: number) {
    setLoanSlider(loan);
    setLoanInput(loan);
  }
  function onLoanInputBlur(loan: number) {
    if (loan >= minPrincipal && loan <= maxPrincipal) {
      handleLoanSliderChange(loan);
    }

    if (loan > maxPrincipal) {
      handleLoanSliderChange(maxPrincipal);
    }
    if (loan < minPrincipal) {
      handleLoanSliderChange(minPrincipal);
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

  const { monthlyPayment, total, totalInterest } = calculateLoan(loanSlider, interestRate, monthsSlider);
  /**********optimist ui************* */
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/?index";

  return (
    <Form method="post" action="/?index">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de prestamos personales</CardTitle>
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
              <p className="text-2xl">Cuota mensual</p>
              <div className="text-right">
                <p className="text-2xl">
                  {monthlyPayment} &euro;<span className="text-sm">/mes</span>
                </p>
                <input type="hidden" name="monthly_quota" value={monthlyPayment} />
                <span className="text-sm font-medium text-muted-foreground">Total vencida {total} &euro;</span>
                <input type="hidden" name="total" value={total} />
              </div>
            </div>
            <Separator />
            <div className="grid gap-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <p>Intereses</p>
                <span className="font-bold">{totalInterest} &euro;</span>
                <input type="hidden" name="interest" value={totalInterest} />
              </div>
              <div className="flex justify-between">
                <p>Monto del préstamo</p>
                <span className="font-bold">{Intl.NumberFormat().format(loanSlider)} &euro;</span>
              </div>
              <div className="flex justify-between">
                <p>Fecha de retorno</p>
                <time className="font-medium">{dateOfReturn}</time>
                <input type="hidden" name="date_of_return" value={dateOfReturn} />
              </div>
              <div className="flex justify-between">
                <p>TIN {TIN}%</p>
                <time className="font-medium">Apertura de la comisión 0.00&euro;</time>
              </div>
              <div className="flex justify-between">
                <p>TAE 13,69%</p>
                <time className="font-medium">Comité de estudio 0.00&euro;</time>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled={isSubmitting} type="submit" isFullWidth className="font-bold">
            {isSubmitting ? "PEDIR PRÉSTAMO..." : "PEDIR PRÉSTAMO"}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
function LoanField({ loanSlider, handleLoanSliderChange, loanInput, onLoanInputBlur, setLoanInput }: Record<string, any>) {
  return (
    <div className="flex flex-col gap-y-4 md:gap-y-0">
      <Label htmlFor="amount">Cuanto necesitas?</Label>
      <div className="grid gap-4 md:grid-cols-4">
        <Slider
          id="amount"
          name="amount"
          className="col-span-3"
          value={[loanSlider]}
          step={500}
          min={4000}
          max={35000}
          onValueChange={(value) => handleLoanSliderChange(value[0])}
        />
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
      <Label htmlFor="months">Cuántos meses?</Label>
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
          <span>meses</span>
        </div>
      </div>
    </div>
  );
}
