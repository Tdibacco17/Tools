"use client";
import ContactFormComponent from "@/components/ContactFormComponent/ContactFormComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export interface ContactFormValues {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    consultation: string;
}

export interface ContactRadioValues {
    motocicletas: string,
    lanchas: string,
    autos: string,
    cuatriciclos: string,
    accesorios: string,
    otros: string
}

export interface ErrorsInterface {
    name: string;
    lastname: string;
    phone: string;
    mail: string;
}

function validate(formValues: ContactFormValues, radioValues: ContactRadioValues) {
    let errors = {
        name: "",
        lastname: "",
        phone: "",
        mail: "",
        check: "",
    };

    const nameRegex = /^[A-Za-z]{2,15}$/;
    if (!nameRegex.test(formValues.name)) {
        errors.name = "El nombre sólo puede contener letras y un máximo de 15 caracteres"
    }
    const lastnameRegex = /^[A-Za-z\s]+$/;
    if (!lastnameRegex.test(formValues.lastname)) {
        errors.lastname = "El apellido sólo puede contener letras y un máximo de 15 caracteres"
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formValues.phone)) {
        errors.phone = "El teléfono sólo puede contener números";
    }

    const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!mailRegex.test(formValues.email)) {
        errors.mail = "Formato de E-mail incorrecto"
    }

    if (radioValues && typeof radioValues === 'object') {
        const isAnyValueSelected = Object.values(radioValues).some((value) => value !== '');
        if (!isAnyValueSelected) {
            errors.check = "Debes seleccionar al menos un tema";
        }
    }

    return errors;
};

export default function ContactContainer({
    isContactPage,
    openContact }: {
        isContactPage?: boolean,
        openContact?: boolean
    }) {

    const [formValues, setFormValues] = useState<ContactFormValues>({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        consultation: "",
    });
    const [radioValues, setRadioValues] = useState<ContactRadioValues>({
        motocicletas: "",
        lanchas: "",
        autos: "",
        cuatriciclos: "",
        accesorios: "",
        otros: ""
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const [btnSubmitClicked, setBtnSubmitClicked] = useState(false);
    const [adblockMsg, setAdblockMsg] = useState(true)

    const [errorMessage, setErrorMessage] = useState<string>("")
    const errorMessageTimerRef = useRef<NodeJS.Timeout | undefined>();
    const [notification, setNotification] = useState<{
        content: string,
        isOpen: boolean
    }>({
        content: "",
        isOpen: false,
    });

    const [errors, setErrors] = useState({})

    const submitEnquiryForm = async ({
        gRecaptchaToken,
    }: {
        gRecaptchaToken: string,
    }) => {
        const response = await fetch("api/enquiry", {
            // cache: "no-store",
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gRecaptchaToken })
        });

        if (!response.ok) {
            setBtnSubmitClicked(false);
            setNotification({
                content: "Captcha no valido",
                isOpen: true,
            })
            setTimeout(() => {
                setNotification({
                    content: "",
                    isOpen: false,
                });
            }, 5000);
            // console.log("throw error")
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.success === false && adblockMsg) {
            setBtnSubmitClicked(false);
            setAdblockMsg(false);
            setNotification({
                content: "Captcha no valido, deshabilite bloqueador de anuncios",
                isOpen: true,
            })
            setTimeout(() => {
                setNotification({
                    content: "",
                    isOpen: false,
                });
            }, 5000);
            return
        }

        if (responseData.success === true) {
            const response = await fetch("api/contact", {
                // cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formValues,
                    radioValues,
                }),
            })
            const respuesta = await response.json();
            // console.log("respuesta", respuesta)

            if (respuesta.status === 200) {
                setBtnSubmitClicked(false);
                setFormValues({
                    name: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    consultation: "",
                });
                setRadioValues({
                    motocicletas: "",
                    lanchas: "",
                    autos: "",
                    cuatriciclos: "",
                    accesorios: "",
                    otros: ""
                });
                setNotification({
                    content: "Email enviado correctamente",
                    isOpen: true,
                })
                setTimeout(() => {
                    setNotification({
                        content: "",
                        isOpen: false,
                    });
                }, 5000);
                return
            }
            setBtnSubmitClicked(false);
            setNotification({
                content: "Ocurrio algo inesperado al enviar el email.",
                isOpen: true,
            })
            setTimeout(() => {
                setNotification({
                    content: "",
                    isOpen: false,
                });
            }, 5000);
            return
        } else {
            setBtnSubmitClicked(false);
            setNotification({
                content: "Captcha no valido",
                isOpen: true,
            })
            setTimeout(() => {
                setNotification({
                    content: "",
                    isOpen: false,
                });
            }, 5000);
            return
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (errorMessage) {
            setErrorMessage("");
        }

        if (e.target.type === "checkbox") {
            const optionId = e.target.name;
            setRadioValues((prevRadioValues) => ({
                ...prevRadioValues,
                [optionId]: prevRadioValues[optionId as keyof typeof prevRadioValues] === "" ? e.target.value : "",
            }));
            setErrors(validate(formValues, {
                ...radioValues,
                [optionId]: radioValues[optionId as keyof typeof radioValues] === "" ? e.target.value : "",
            }));

        } else {
            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                [e.target.name]: e.target.value,
            }));
            setErrors(validate({
                ...formValues,
                [e.target.name]: e.target.value
            }, radioValues));
        }
    };

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnSubmitClicked(true);

        const validationErrors = validate(formValues, radioValues);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === "")) {
            if (errorMessageTimerRef.current) {
                clearTimeout(errorMessageTimerRef.current);
            }

            if (!executeRecaptcha) {
                setBtnSubmitClicked(false);
                return;
            }

            try {
                const gRecaptchaToken = await executeRecaptcha("enquiryFormSubmit");
                submitEnquiryForm({ gRecaptchaToken });
            } catch (error) {
                // Manejar errores aquí si es necesario
                setBtnSubmitClicked(false);
                console.log(error)
            }
        } else {
            setBtnSubmitClicked(false);
            return
        }
    }, [executeRecaptcha, formValues, radioValues, adblockMsg]);

    return <ContactFormComponent
        handleSubmit={handleSubmit}
        formValues={formValues}
        radioValues={radioValues}
        handleChange={handleChange}
        errors={errors}
        btnSubmitClicked={btnSubmitClicked}
        isContactPage={isContactPage}
        openContact={openContact}
        notification={notification}
    />
}
