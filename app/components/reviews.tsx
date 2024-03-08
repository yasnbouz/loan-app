const testimonials = [
  {
    body: "I’m so glad I chose Moneyeget for my loan. Their transparent pricing and superior customer service have made me a customer for life.",
    author: {
      name: " Aurelio Vicente",
      handle: "aureliovicente",
      imageUrl: "https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "I’m thrilled with the fast and easy loan process at Moneyeget. Their customer service is top-notch and they truly care about their customers’ needs.",
    author: {
      name: " Raúl Valero",
      handle: " raúlvalero",
      imageUrl: "https://images.unsplash.com/photo-1654110455429-cf322b40a906?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Moneyeget has been a lifesaver! Their low-interest rates and flexible repayment options made my financial situation much more manageable.",
    author: {
      name: " Amanda Anunciación",
      handle: "amandaanunciación",
      imageUrl: "https://plus.unsplash.com/premium_photo-1677368597077-009727e906db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "I highly recommend Moneyeget. They offer quick approval and transparent terms. It’s refreshing to deal with such a trustworthy lender.",
    author: {
      name: " Amadeo Sixto",
      handle: "amadeosixto",
      imageUrl: "https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Moneyeget easy-to-understand terms and no hidden fees policy are a breath of fresh air. They are truly a customer-first company.",
    author: {
      name: " Isabel Bienvenida",
      handle: "isabelbienvenida",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "I’ve taken out a few loans in my time, but none as smooth and hassle-free as with Moneyeget. Their friendly staff and efficient service are second to none.",
    author: {
      name: " Isidora Áurea",
      handle: "isidoraaurea ",
      imageUrl: "https://images.unsplash.com/photo-1643732994192-03856731da2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More testimonials...
];

export default function Reviews() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">98% of satisfied customers last year</p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-muted p-8 text-sm leading-6">
                  <blockquote className="text-foreground">
                    <p>{`“${testimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img className="h-10 w-10 rounded-full" src={testimonial.author.imageUrl} alt="" />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author.name}</div>
                      <div className="text-muted-foreground">{`@${testimonial.author.handle}`}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
